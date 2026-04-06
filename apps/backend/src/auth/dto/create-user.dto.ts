import { Transform } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchPassword', async: false })
export class MatchPasswordConstraint implements ValidatorConstraintInterface {
  validate(repeatPassword: unknown, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints as [string];
    const relatedValue = (args.object as Record<string, unknown>)[
      relatedPropertyName
    ];
    return repeatPassword === relatedValue;
  }

  defaultMessage() {
    return 'Passwords do not match';
  }
}

export class CreateUserDto {
  @IsString({ message: 'First name is required' })
  @MinLength(1, { message: 'First name is required' })
  @MaxLength(120, { message: 'First name is too long' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  firstName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120, { message: 'Last name is too long' })
  @Transform(({ value }) => {
    if (value === null || value === undefined) return undefined;
    if (typeof value !== 'string') return value;
    const t = value.trim();
    return t.length === 0 ? undefined : t;
  })
  lastName?: string;

  @IsEmail({}, { message: 'Enter a valid email address' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value,
  )
  email!: string;

  @IsString({ message: 'Password is required' })
  @MinLength(1, { message: 'Password is required' })
  @MaxLength(128, { message: 'Password is too long' })
  password!: string;

  @IsString({ message: 'Repeat password is required' })
  @MinLength(1, { message: 'Repeat password is required' })
  @MaxLength(128, { message: 'Repeat password is too long' })
  @Validate(MatchPasswordConstraint, ['password'])
  repeatPassword!: string;

  @IsBoolean({ message: 'You must agree to terms & conditions' })
  @Equals(true, { message: 'You must agree to terms & conditions' })
  agreeToTerms!: boolean;
}
