// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../modules/auth/enums/user-role.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
