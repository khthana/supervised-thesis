import type { z } from 'zod';

import { DefaultAuthSchema } from '@shared/types/auth.model';

export type CreateAccessTokenPayload = z.infer<typeof CreateAccessTokenPayloadSchema>;
const CreateAccessTokenPayloadSchema = DefaultAuthSchema.AccessTokenPayloadSchema.omit({
	iat: true,
}).openapi({
	description: 'Schema for creating a new access token',
});

export type CreateRefreshTokenPayload = z.infer<typeof CreateRefreshTokenPayloadSchema>;
const CreateRefreshTokenPayloadSchema = DefaultAuthSchema.RefreshTokenPayloadSchema.omit({
	iat: true,
}).openapi({
	description: 'Schema for creating a new refresh token',
});
