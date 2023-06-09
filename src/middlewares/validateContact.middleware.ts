import { NextFunction, Request, Response } from "express";
import { EntityTarget, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { AppError } from "../error";
import { uuidSchema } from "../shcemas/uuid.schema";
import { Client } from "../entities/client.entity";
import { Contact } from "../entities/contact.entity";
import { User } from "../entities/user.entity";


const validateContactMiddleware = async (req:Request, res: Response, next: NextFunction): Promise<void> => {
    const userId: string = uuidSchema.parse(res.locals.id)       
    const contactId: string = uuidSchema.parse(req.params.id)
    
    const contactRepository: Repository<Contact> = AppDataSource.getRepository(Contact)

    const contactInstance: Contact[] = await contactRepository.find({relations: {client: true}, where: {id: contactId}})  
    
    if (!contactInstance.length) {
        throw new AppError("Contact id not found", 404)
    }

    const clientId: string = contactInstance[0].client.id

    const userContactInstance: Contact | null = await contactRepository.findOneBy({id: contactId, user: {id: userId}})
    
    if (!userContactInstance) {
        throw new AppError("This contact doesn't belong to you", 401)
    }
    
    
    return next()
}


export default validateContactMiddleware