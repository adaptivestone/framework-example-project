import FrameworkAuth from '@adaptivestone/framework/controllers/Auth.js';

/**
 * Minimal framework-controller override. The parenthesized folder organizes
 * customization points without changing `/auth`, and its `Auth.ts` filename
 * still suppresses the framework's built-in controller during both boot and
 * route-type generation. Add application-specific auth behavior here.
 */
class Auth extends FrameworkAuth {}

export default Auth;
