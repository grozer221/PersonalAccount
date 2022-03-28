using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PersonalAccount.Server.Migrations
{
    public partial class addedMinutesBeforeLessonNotification : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MinutesBeforeLessonNotification",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "MinutesBeforeLessonsNotification",
                table: "Users");
        }
    }
}
