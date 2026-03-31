import { Controller, Get, Route, Query, Tags, Patch, Path, Body, Delete, Request } from "tsoa";
import { AppDataSource } from "../../../../config/data-source";
import { User, UserRole } from "../../../../entity/User";
import { ApiResponseList, ApiResponseSingle, ApiError } from "../../../../../shared/api/ApiResponse";
import { FindOptionsWhere, Like } from "typeorm";
import { escapeLikeWildcards } from "../../../../utils/filter.utils";

const userRepo = AppDataSource.getRepository(User);

interface UpdateUserDTO {
  role?: UserRole;
  isActive?: boolean;
}

@Route("api/users")
@Tags("Users")
export class UserController extends Controller {

  @Get("")
  public async getAll(
    @Query() page = 0,
    @Query() size = 10,
    @Query() filter?: string,
    @Query() role?: UserRole,
    @Query() isActive?: boolean
  ): Promise<ApiResponseList<User>> {
    const where: FindOptionsWhere<User> = {};

    if (filter) {
      where.username = Like(`%${escapeLikeWildcards(filter)}%`);
    }

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [users, total] = await userRepo.findAndCount({
      where,
      order: { lastLoginAt: "DESC" },
      skip: page * size,
      take: size,
      select: ['id', 'username', 'displayName', 'email', 'avatarUrl', 'role', 'isActive', 'lastLoginAt', 'createdAt']
    });

    return {
      data: users,
      meta: {
        page,
        limit: size,
        total
      }
    };
  }

  @Get("{id}")
  public async getOne(
    @Path() id: number
  ): Promise<ApiResponseSingle<User> | ApiError> {
    const user = await userRepo.findOne({
      where: { id },
      select: ['id', 'username', 'displayName', 'email', 'avatarUrl', 'role', 'isActive', 'lastLoginAt', 'createdAt']
    });

    if (!user) {
      return {
        message: "User not found",
        code: 404
      };
    }

    return {
      data: user
    };
  }

  @Patch("{id}")
  public async update(
    @Path() id: number,
    @Body() body: UpdateUserDTO,
    @Request() req: { user?: { dbUser?: User } }
  ): Promise<ApiResponseSingle<User> | ApiError> {
    // Check if current user is admin
    const currentUser = req.user?.dbUser as User | undefined;
    if (!currentUser || currentUser.role !== UserRole.Admin) {
      return {
        message: "Only admins can update users",
        code: 403
      };
    }

    const user = await userRepo.findOne({ where: { id } });

    if (!user) {
      return {
        message: "User not found",
        code: 404
      };
    }

    // Prevent self-demotion from admin
    if (currentUser.id === user.id && body.role && body.role !== UserRole.Admin) {
      return {
        message: "Cannot change your own role from admin",
        code: 400
      };
    }

    if (body.role) user.role = body.role;
    if (body.isActive !== undefined) user.isActive = body.isActive;

    await userRepo.save(user);

    return {
      data: user
    };
  }

  @Delete("{id}")
  public async delete(
    @Path() id: number,
    @Request() req: { user?: { dbUser?: User } }
  ): Promise<{ message: string } | ApiError> {
    // Check if current user is admin
    const currentUser = req.user?.dbUser as User | undefined;
    if (!currentUser || currentUser.role !== UserRole.Admin) {
      return {
        message: "Only admins can delete users",
        code: 403
      };
    }

    // Prevent self-deletion
    if (currentUser.id === id) {
      return {
        message: "Cannot delete your own account",
        code: 400
      };
    }

    const result = await userRepo.delete(id);

    if (result.affected === 0) {
      return {
        message: "User not found",
        code: 404
      };
    }

    return {
      message: "User deleted successfully"
    };
  }

  @Get("roles/list")
  public async getRoles(): Promise<string[]> {
    return Object.values(UserRole);
  }
}
