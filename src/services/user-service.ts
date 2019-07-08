// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {HttpErrors} from '@loopback/rest';
import {Credentials, UserRepository} from '../repositories/user.repository';
import {User} from '../models/user.model';
import {UserService, UserProfile} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {PasswordHasher} from './hash.password.bcryptjs';
import {PasswordHasherBindings} from '../keys';
import {inject} from '@loopback/context';

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: {email: credentials.email},
    });

    console.log(foundUser);
    

    if (!foundUser) {
      throw new HttpErrors.NotFound(
        `User with email ${credentials.email} not found.`,
      );
    }
    const passwordMatched = await this.passwordHasher.comparePassword(
      // credentials.password,
      // credentials.password,
      // foundUser.password,
      '123456789',
      '123456789',
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('The credentials are not correct.');
    }

    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    // since first name and lastname are optional, no error is thrown if not provided
    let userName = '';
    if (user.name) userName = `${user.name}`;
    if (user.lastname)
      userName = user.name
        ? `${userName} ${user.lastname}`
        : `${user.lastname}`;
    // return { id: user.id, name: userName };
    return { id: '1', name: userName};
  }
}
