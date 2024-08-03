import { PrismaClient } from '@prisma/client';
import { Role } from "@prisma/client";

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

    async login(email: string, password: string): Promise<String> {
        try {
            const account = await prisma.user.findUnique({
                where: { email },
            });

            if (account && account.password === password) {
                this.id = account.id;
                this.name = account.name
                return "success"
            }
            return "error";
        } catch (error) {
            console.error('Error during login:', error instanceof Error);
            return "error";
        }
    }
}

export default User;