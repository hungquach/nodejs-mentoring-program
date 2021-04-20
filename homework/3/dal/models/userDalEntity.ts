  import {
    Table,
    Column,
    Model,
    Unique,
    DataType,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';

@Table({
    tableName: 'users',
})
export default class userDalEntity extends Model {
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

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt!: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt!: Date;
}