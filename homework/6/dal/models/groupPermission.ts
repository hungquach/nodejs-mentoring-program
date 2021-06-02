import {
    Table,
    Column,
    Model,
    Unique,
    DataType,
    CreatedAt,
    UpdatedAt,
    ForeignKey
} from 'sequelize-typescript';

import Group from './group';
import Permission from './permission';

@Table({
    tableName: 'group_permission',
})

export default class GroupPermission extends Model {   
    @ForeignKey(() => Group)
    @Column
    groupId!: string;
    
    @ForeignKey(() => Permission)
    @Column
    permissionId!: number;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt!: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt!: Date;
}
