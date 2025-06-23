import { UserAddress } from "../entities/UserAddress";
import { MyContext } from "src/types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { UpdateUserAddressInput, UserAddressInput } from "../inputs/UserAddressInput";
import { User } from "../entities/User";

@Resolver()
export class UserAddressResolver {
    @Query(() => [UserAddress])
    async userAddressList(@Ctx() { em }: MyContext): Promise<UserAddress[]> {
        return await em.find(UserAddress, {});
    }

    @Query(() => UserAddress, { nullable: true })
        async userAddress(
        @Arg("id") id: string,
        @Ctx() { em, req }: MyContext
        ): Promise<UserAddress | null> {
        if (!req.session.userId) {
            throw new Error("Not authenticated");
        }

        const address = await em.findOne(UserAddress, { id }, { populate: ["user"] });
        
        if (!address || address.user.id !== req.session.userId) {
            throw new Error("Not found");
        }

        return address;
        }


    @Mutation(() => UserAddress)
    async createUserAddress(
        @Arg("input", () => UserAddressInput) input: UserAddressInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserAddress> {
        if (!req.session.userId) {
            throw new Error("Not authenticated");
        }

        const user = await em.findOne(User, { id: req.session.userId });
        if (!user) throw new Error("User not found");

        const address = em.create(UserAddress, {
            ...input,
            user,
            isDefaultShipping: false,
            isDefaultBilling: false
        });

        await em.persistAndFlush(address);
        return address;
    }

    @Mutation(() => UserAddress)
    async updateUserAddress(
        @Arg("id") id: string,
        @Arg("input", () => UpdateUserAddressInput) input: UpdateUserAddressInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserAddress> {
        if (!req.session.userId) {
            throw new Error("Not authenticated");
        }

        const address = await em.findOne(UserAddress, { id }, { populate: ["user"] });
        if (!address) {
            throw new Error("Address not found");
        }

        if (address.user.id !== req.session.userId) {
            throw new Error("Not authorized");
        }

        em.assign(address, input); // safely update fields
        await em.persistAndFlush(address);

        return address;
    }


    @Query(() => [UserAddress])
        async myAddresses(
        @Ctx() { em, req }: MyContext
        ): Promise<UserAddress[]> {
        if (!req.session.userId) {
            throw new Error("Not authenticated");
        }

        return await em.find(UserAddress, {
            user: req.session.userId,
        });
        }
}
