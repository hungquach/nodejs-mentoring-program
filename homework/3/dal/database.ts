import { Sequelize } from "sequelize-typescript";
import User from './models/userDalEntity';
import { v4 as uuidv4 } from 'uuid';

const initDatabase = async () => {
    let connectionString = process.env.CONNECTION_STRING ?? "";
    console.log("connectionString" + connectionString);

    let sequelize = new Sequelize(connectionString);
    sequelize.addModels([User]);

    await sequelize.sync({force: true});

    return sequelize;
}

const seedUsers = async () => {
    await User.create({
        id: uuidv4(),
        login: "apple",
        password: "P@ssword123",
        age: 29,
        isDeleted: false
    });
    await User.create({
        id: uuidv4(),
        login: "banana",
        password: "P@ssword123",
        age: 29,
        isDeleted: false
    });
    await User.create({
        id: uuidv4(),
        login: "lemon",
        password: "P@ssword123",
        age: 29,
        isDeleted: true
    });
    await User.create({
        id: uuidv4(),
        login: "watermelon",
        password: "P@ssword123",
        age: 29,
        isDeleted: true
    });
    await User.create({
        id: uuidv4(),
        login: "peach",
        password: "P@ssword123",
        age: 29,
        isDeleted: true
    });
    await User.create({
        id: uuidv4(),
        login: "cherry",
        password: "P@ssword123",
        age: 29,
        isDeleted: true
    });
};

export {
    initDatabase,
    seedUsers
};




//const sequelize = new Sequelize(connectionString);

// sequelize.authenticate().then(() => {
//     console.log("Connection has been established successfully.")
// })
// .catch(err => {
//     console.log("Unable to connect to the database.")
// });

// User.init({
//     id: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         primaryKey: true,
//     },
//     login: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     age: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//     },
//     isDeleted: {
//         type: DataTypes.BOOLEAN,
//         allowNull: false
//     }
// },
//     {
//         tableName: "users",
//         sequelize,
//     }
// );

// export {
//     User
// }