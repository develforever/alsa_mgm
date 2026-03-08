

```sql

SELECT 
    CONCAT('RENAME TABLE ', table_schema, '.', table_name, 
           ' TO ', 'new_name', '.', table_name, ';') AS rename_commands
FROM 
    information_schema.tables 
WHERE 
    table_schema = 'old_name';

```