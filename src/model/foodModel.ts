import { DataTypes, Model } from "sequelize";
import {db} from '../config'
export interface FoodAttribute {
    id: string,
    name: string,
    description: string,
    category: string,
    foodType: string,
    readyTime: number,
    price: number,
    vendor_id: string
}

export class FoodInstance extends Model<FoodAttribute>{}

FoodInstance.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    foodType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    readyTime: {
        type: DataTypes.NUMBER,
        allowNull: false,
    }, 
    price: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    
    vendor_id: {
        type: DataTypes.STRING,
        allowNull: true
    }
},
{
    sequelize: db,
    tableName: 'food'
}
)