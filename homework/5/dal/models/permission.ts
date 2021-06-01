import {
    Table,
    Column,
    Model,
    Unique,
    DataType,
    CreatedAt,
    UpdatedAt,
    BelongsToMany
} from 'sequelize-typescript';

import Group from './group'
import GroupPermission from './groupPermission'

@Table({
    tableName: 'permission',
})

export default class Permission extends Model {   
    @Column({
        type: DataType.INTEGER,
        defaultValue: DataType.STRING,
        primaryKey: true,
    })
    id!: number;
    
    @Column
    name!: string;

    @BelongsToMany(() => Group, () => GroupPermission)
    group!: Group[];

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt!: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt!: Date;
}
