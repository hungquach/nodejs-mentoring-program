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

import Permission from './permission';
import GroupPermission from './groupPermission';
import UserGroup from './userGroup';
import User from './user';

@Table({
    tableName: 'group',
})

export default class Group extends Model {   
    @Column({
        type: DataType.STRING,
        defaultValue: DataType.STRING,
        primaryKey: true,
    })
    id!: string;
    
    @Column
    name!: string;
    
    @BelongsToMany(() => Permission, () => GroupPermission)
    permissions!: Permission[]

    @BelongsToMany(() => User, () => UserGroup)
    users!: User[]

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt!: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt!: Date;
}
