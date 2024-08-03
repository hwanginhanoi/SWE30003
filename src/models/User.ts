import { PrismaClient } from '@prisma/client';
import { Role } from "@prisma/client";
import Admin from "./Admin"
import Customer from "./Customer";

const prisma = new PrismaClient();

abstract class User {
    public name: string;
    public email: string;
    public role: Role;
    private readonly password: string;
    protected id?: number;

    protected constructor(name: string, email: string, password: string, role: Role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    getJsonObject(): object {
        return {
            name: this.name,
            email: this.email,
            role: this.role,
            id: this.id
        };
    }

    async register(): Promise<String> {
        try {
            const account = await prisma.user.create({
                data: {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    role: this.role,
                },
            });
            this.id = account.id;
            return "success"
        } catch (error) {
            console.error('Error registering account:', error);
            return "error"
        }
    }

    static async login(email: string, password: string): Promise<User | null> {
        try {
            const account = await prisma.user.findUnique({
                where: { email },
            });

            if (account && account.password === password) {
                let user: User;
                if (account.role === Role.Admin) {
                    user = new Admin(account.name, account.email, account.password);
                } else {
                    user = new Customer(account.name, account.email, account.password);
                }

                user.id = account.id;
                return user;
            }
            return null;
        } catch (error) {
            console.error('Error during login:', error instanceof Error);
            return null;
        }
    }

    static async findById(id: number): Promise<User | null> {
        try {
            const user = await prisma.user.findUnique({
                where: { id },
            });

            if (user) {
                if (user.role === Role.Customer) {
                    return new Customer(user.name, user.email, user.password);
                } else if (user.role === Role.Admin) {
                    return new Admin(user.name, user.email, user.password);
                }
            }
            return null;
        } catch (error) {
            console.error('Error finding user by ID:', error);
            return null;
        }
    }

}

export default User;