// import { Resolver, Query, Mutation, Arg, Ctx, ObjectType, Field, InputType } from "type-graphql";
// import { Category } from "../entities/Category";
// import { InjectRepository } from "@mikro-orm/nestjs";
// import { EntityRepository } from "@mikro-orm/core";
// import { MyContext } from "../types";
// import { FieldError } from "../shared/ferror";

// @InputType()
// class CategoryInput {
//   @Field()
//   name!: string;

//   @Field({ nullable: true})
//   parentCategoryId?: string;
// }

// @ObjectType()
// class CategoryResponse {
//   @Field(() => [FieldError], { nullable: true })
//   errors?: FieldError[];

//   @Field(() => Category, { nullable: true })
//   category?: Category;
// }

// @Resolver(Category)
// export class CategoryResolver {
//   constructor(@InjectRepository(Category) private readonly categoryRepository: EntityRepository<Category>) {}

//   @Query(() => [Category])
//   async categories(@Ctx() { em }: MyContext): Promise<Category[]> {
//     if (!em) throw new Error("EntityManager not found in context");
//     return await em.findAll(Category, {populate: ["subcategories"]});
//   }

//   @Query(() => Category)
//   async category(@Arg("id") id: string, @Ctx(){}: MyContext): Promise<Category | null> {
//     return await this.categoryRepository.findOne({ id }, { populate: ["products","subcategories"] });
//   }

//   @Query(()=> [Category])
//   async subcategories(@Arg("parentCategoryId") parentCategoryId: string): Promise<Category[]>{
//     return await this.categoryRepository.find({parentCategory: parentCategoryId});
//   }

//   @Mutation(() => CategoryResponse)
//     async createCategory(
//       @Arg("options") options: CategoryInput,
//       @Ctx() { em }: MyContext 
//     ): Promise<CategoryResponse> {
//       const existingCategory = await this.categoryRepository.findOne({ name: options.name });

//       if (existingCategory) {
//         return { errors: [{ field: "name", message: "This category already exists" }] };
//       }

//       let parentCategory = null;
//       if (options.parentCategoryId) {
//         parentCategory = await this.categoryRepository.findOne({ id: options.parentCategoryId });
//         if (!parentCategory) {
//           return { errors: [{ field: "parentCategoryId", message: "Parent category not found" }] };
//         }
//       }

//       const category = this.categoryRepository.create({
//         name: options.name,
//         parentCategory: parentCategory || null,
//       });

//       await em.persistAndFlush(category);

//       return { category };
//     }  
// }
