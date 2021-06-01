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

import UserGroup from './userGroup';
import Group from './group';

@Table({
    tableName: 'user',
})
export default class User extends Model {
    @Column({
        type: DataType.STRING,
        defaultValue: DataType.STRING,
        primaryKey: true,
    })
    id!: string;

    @Unique
    @Column
    login!: string;

    @Column
    password!: string;

    @Column
    age!: number;

    @Column
    isDeleted!: boolean;

    @BelongsToMany(() => Group, () => UserGroup)
    groups!: Group[]

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt!: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt!: Date;
}