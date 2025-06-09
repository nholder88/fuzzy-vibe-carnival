import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Role } from './role.model';

export enum PermissionType {
  // User permissions
  CREATE_USER = 'create_user',
  READ_USER = 'read_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',

  // Household permissions
  CREATE_HOUSEHOLD = 'create_household',
  READ_HOUSEHOLD = 'read_household',
  UPDATE_HOUSEHOLD = 'update_household',
  DELETE_HOUSEHOLD = 'delete_household',
  MANAGE_HOUSEHOLD_MEMBERS = 'manage_household_members',

  // Chore permissions
  CREATE_CHORE = 'create_chore',
  READ_CHORE = 'read_chore',
  UPDATE_CHORE = 'update_chore',
  DELETE_CHORE = 'delete_chore',
  ASSIGN_CHORE = 'assign_chore',

  // Inventory permissions
  CREATE_INVENTORY = 'create_inventory',
  READ_INVENTORY = 'read_inventory',
  UPDATE_INVENTORY = 'update_inventory',
  DELETE_INVENTORY = 'delete_inventory',

  // Shopping permissions
  CREATE_SHOPPING_LIST = 'create_shopping_list',
  READ_SHOPPING_LIST = 'read_shopping_list',
  UPDATE_SHOPPING_LIST = 'update_shopping_list',
  DELETE_SHOPPING_LIST = 'delete_shopping_list',
  MANAGE_INSTACART_ORDERS = 'manage_instacart_orders',
}

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PermissionType,
    unique: true,
  })
  name: PermissionType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
