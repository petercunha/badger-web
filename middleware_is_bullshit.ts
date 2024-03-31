import prisma from "./db";

export async function getSession(sessionToken?: string) {
    return await prisma.session.findFirst({ where: { token: sessionToken } })
}