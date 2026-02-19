import type { UserSchema } from '@shared/types/users/user.model';

export interface IUserRegister {
	email: string;
	password: string;
	title_en: string;
	title_th: string;
	firstname_en: string;
	firstname_th: string | null;
	lastname_en: string;
	lastname_th: string | null;
	profile_image: string | null;
}

export interface IUserLogin {
	email: string;
	password: string;
}

export interface IUserGoogleOAuth2 {
	provider: string;
	email: string;
	accessToken: string;
}

// export interface IUser {
// 	success: boolean;
// 	message: string;
// 	// responseObject: Omit<typeof UserSchema, 'password_hash'>
// 	responseObject: typeof UserSchema;
// 	statusCode: number;
// }

export interface IUserData {
	user_id: number;
	email: string;
	firstname_th: string;
	lastname_th: string;
	firstname_en: string;
	lastname_en: string;
	role: string;
	is_verified: boolean;
	is_active: boolean;
}

// export interface IUser {
// 	id: number;
// 	email: string;
// 	kmitl_email: string | null;
// 	name_title: {
// 		en: string;
// 		th: string;
// 	};
// 	firstname: {
// 		en: string;
// 		th: string | null;
// 	};
// 	lastname: {
// 		en: string;
// 		th: string | null;
// 	};
// 	profile_image: string | null;
// 	roles: string[];
// 	is_verified: boolean;
// 	is_active: boolean;
// }

export interface INameTitle {
	en: string;
	th: string;
}
