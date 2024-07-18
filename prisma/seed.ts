import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
	const hashedPassword = await bcrypt.hash("isvilladmin", 10);
	await prisma.user.create({
		data: {
			uuid: uuidv4(),
			username: "superadmin",
			password: hashedPassword,
			roles: "SUPERADMIN",
			full_name: "Admin Superuser",
		},
	});
}

main()
	.then(() => {
		console.log("Seed data created successfully");
	})
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
