import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
	return new PrismaClient()
}

declare global {
	// eslint-disable-next-line no-unused-vars
	var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

// eslint-disable-next-line no-undef
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
