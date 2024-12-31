import { PrismaClient, ChatType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create users
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        firstName: "Alice",
        lastName: "Johnson",
        username: "alice_j",
      },
      {
        id: 2,
        firstName: "Bob",
        lastName: "Smith",
        username: "bob_s",
      },
    ],
  });

  // Create chat
  await prisma.chat.create({
    data: {
      id: 1,
      title: "Roommates",
      type: "group",
      members: {
        connect: [{ id: 1 }, { id: 2 }],
      },
    },
  });

  // Create expense
  const expense = await prisma.expense.create({
    data: {
      id: "1",
      chatId: 1,
      creatorId: 1,
      description: "Grocery Shopping",
      amount: 100.0,
      splitMode: "EQUAL",
      participants: {
        connect: [{ id: 1 }, { id: 2 }],
      },
      shares: {
        createMany: {
          data: [
            { userId: 1, amount: 50.0 },
            { userId: 2, amount: 50.0 },
          ],
        },
      },
    },
  });

  // Create settlement
  await prisma.settlement.create({
    data: {
      id: "1",
      chatId: 1,
      senderId: 2,
      receiverId: 1,
      amount: 50.0,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
