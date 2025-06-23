import { EntityManager } from "@mikro-orm/core";
import { UserAddress } from "../entities/UserAddress";

export async function getAddressOrDefault(
  em: EntityManager,
  userId: string,
  providedId: string | null | undefined,
  type: "shipping" | "billing"
): Promise<UserAddress> {
  if (providedId) {
    return await em.findOneOrFail(UserAddress, { id: providedId, user: userId });
  }

  return await em.findOneOrFail(UserAddress, {
    user: userId,
    ...(type === "shipping"
      ? { isDefaultShipping: true }
      : { isDefaultBilling: true }),
  });
}
