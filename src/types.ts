import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from "express";
import { Session,SessionData } from "express-session";

export type MyContext ={
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
    req: Request& { session: Session & Partial<SessionData> & { userId?: string } & { companyId?: string} & { categoryId? : string} & {productId?: string} & {adminId?: string} & {variationId: string} & {orderId: string}} ;
    res: Response;
}