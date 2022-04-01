using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PersonalAccount.Server.Migrations
{
    public partial class addedsubjecttonotification : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Subject",
                table: "Notifications",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Subject",
                table: "Notifications");
        }
    }
}
