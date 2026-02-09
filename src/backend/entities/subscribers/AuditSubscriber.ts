// backend/src/entities/subscribers/AuditSubscriber.ts
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent, SoftRemoveEvent } from "typeorm";
import { AuditLog } from "../../entity/AuditLog";

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {


    async afterInsert(event: InsertEvent<any>) {
        if (event.metadata.target === AuditLog) return;
        await this.log(event, "CREATE");
    }

    async afterUpdate(event: UpdateEvent<any>) {
        if (event.metadata.target === AuditLog) return;
        await this.log(event, "UPDATE");
    }

    async afterSoftRemove(event: SoftRemoveEvent<any>) {
        if (event.metadata.target === AuditLog) return;
        await this.log(event, "SOFT-DELETE");
    }

    private async log(event: any, action: string) {
        const repo = event.manager.getRepository(AuditLog);

        const data = event.queryRunner?.data;
        const userEmail = data?.userEmail || "anonymous@github.com";

        const log = repo.create({
            action: action,
            entityName: event.metadata.name,
            entityId: event.entity?.ProductID
                || event.entity?.ALAssLineID
                || event.entity?.ALWStationID
                || event.entity?.ALAssLineWStationAllocationID
                || "N/A",
            details: event.entity,
            userEmail: userEmail
        });
        await repo.save(log);
    }
}