import { createThemeAction } from 'remix-themes';
import { themeSessionResolver } from '../server/sessions/theme.server';

export const action = createThemeAction(themeSessionResolver);
