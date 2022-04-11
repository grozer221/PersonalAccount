using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PersonalAccount.Server.Migrations
{
    public partial class moveduserscolumninsettings : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PersonalAccounts");

            migrationBuilder.DropTable(
                name: "TelegramAccounts");

            migrationBuilder.DropColumn(
                name: "EnglishSubGroup",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ExpoPushToken",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Group",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "MinutesBeforeLessonNotification",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "MinutesBeforeLessonsNotification",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SubGroup",
                table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "Settings",
                table: "Users",
                type: "longtext",
                nullable: false,
                defaultValue: "{\"Group\":null,\"SubGroup\":1,\"EnglishSubGroup\":1,\"ExpoPushToken\":null,\"MinutesBeforeLessonNotification\":5,\"MinutesBeforeLessonsNotification\":20,\"PersonalAccount\":null,\"TelegramAccount\":null}")
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Settings",
                table: "Users");

            migrationBuilder.AddColumn<int>(
                name: "EnglishSubGroup",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<string>(
                name: "ExpoPushToken",
                table: "Users",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Group",
                table: "Users",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "MinutesBeforeLessonNotification",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 5);

            migrationBuilder.AddColumn<int>(
                name: "MinutesBeforeLessonsNotification",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 20);

            migrationBuilder.AddColumn<int>(
                name: "SubGroup",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.CreateTable(
                name: "PersonalAccounts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Cookie = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Password = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Username = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PersonalAccounts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PersonalAccounts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "TelegramAccounts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    AuthDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Firstname = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Hash = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Lastname = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PhotoUrl = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TelegramId = table.Column<long>(type: "bigint", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Username = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TelegramAccounts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TelegramAccounts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_PersonalAccounts_UserId",
                table: "PersonalAccounts",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TelegramAccounts_UserId",
                table: "TelegramAccounts",
                column: "UserId",
                unique: true);
        }
    }
}
