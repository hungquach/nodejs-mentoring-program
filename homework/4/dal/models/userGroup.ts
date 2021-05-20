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
import User from './user';

@Table({
    tableName: 'user_group',
})

export default class UserGroup extends Model {   
    @ForeignKey(() => Group)
    @Column
    groupId!: string;
    
    @ForeignKey(() => User)
    @Column
    userId!: string;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt!: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt!: Date;
}
