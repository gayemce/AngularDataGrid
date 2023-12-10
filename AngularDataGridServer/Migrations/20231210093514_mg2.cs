using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AngularDataGridServer.Migrations
{
    /// <inheritdoc />
    public partial class mg2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PublichDate",
                table: "Books",
                newName: "PublishDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PublishDate",
                table: "Books",
                newName: "PublichDate");
        }
    }
}
