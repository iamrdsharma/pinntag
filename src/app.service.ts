import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './models/role.model';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './models/category.model';
import { Seeder } from './seeder/categories.seeder';
import { User, UserDocument } from './user/models/user.model';
import { Roles } from './enums/user.enum';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async onModuleInit() {
    await this.seedRoles();
    await this.seedCategories();
    await this.createDefaultAdmin();
  }
  async seedRoles() {
    const roles = await this.roleModel.find().exec();
    if (!roles.length) {
      await this.roleModel.insertMany(Seeder.roles);
    }
  }

  async seedCategories() {
    const categories = await this.categoryModel.find().exec();
    if (!categories.length) {
      await this.categoryModel.insertMany(Seeder.categories);
    }
  }

  async createDefaultAdmin() {
    const role = await this.roleModel.findOne({ name: Roles.ADMIN }).exec();
    const admin = await this.userModel
      .findOne({ role: role._id, email: process.env.ADMIN_EMAIL })
      .exec();
    if (!admin) {
      await this.userModel.create({
        firstName: process.env.ADMIN_FIRST_NAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        isEmailVerified: true,
        isPhoneVerified: true,
        role: role._id,
      });
    }
  }
}
