-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "twitch_id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "broadcaster_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "profile_image_url" TEXT NOT NULL,
    "offline_image_url" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_twitch_id_key" ON "User"("twitch_id");
