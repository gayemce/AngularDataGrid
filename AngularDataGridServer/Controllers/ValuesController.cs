﻿using Bogus;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.EntityFrameworkCore;

namespace AngularDataGridServer.Controllers;
[Route("api/[controller]/[action]")]
[ApiController]
public class ValuesController(ApplicationDbContext context) : ControllerBase
{
    private static List<Book> Books = new();

    [HttpGet]
    public IActionResult SeedData()
    {
        for(int i = 0; i < 100; i++)
        {
            Faker faker = new();
            Book book = new()
            {
                Name = string.Join(" ", faker.Lorem.Words(3)),
                Author = faker.Name.FullName(),
                PublishDate = faker.Date.BetweenDateOnly(DateOnly.Parse("01.01.1900"), DateOnly.Parse("01.01.2024")),
                Summary = faker.Lorem.Lines(2),
            };

            Books.Add(book);
            //context.Add(book);
            //context.SaveChanges();
        }

        return NoContent();
    }

    [HttpGet]
    [EnableQuery]
    public IActionResult GetAll()
    {
        //var books = context.Books.AsQueryable();

        return Ok(Books);
        //AsQueryable database de ki tüm kaydı çekmek yerine verilen sorgularla son halini çeker.
    }

    [HttpPost]
    public IActionResult Update(Book book)
    {
        context.Update(book);
        context.SaveChanges();
        return NoContent();
    }
}

public sealed class ApplicationDbContext : DbContext
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Data Source=DESKTOP-I7G56NT\\SQLEXPRESS;Initial Catalog=AngularDataGridDb;Integrated Security=True;Connect Timeout=30;Encrypt=False;Trust Server Certificate=False;Application Intent=ReadWrite;Multi Subnet Failover=False");
        //yapılan sorgunun consolda görünmesi için
        optionsBuilder.LogTo(Console.WriteLine, new[] {DbLoggerCategory.Database.Command.Name }, LogLevel.Information);
    }

    public DbSet<Book> Books { get; set; }
}

public sealed record PaginationResponse<T>
    where T : class
{
    public T? Data { get; init; }
    public int TotalCount { get; init; }
}

public sealed class Book
{
    public Book()
    {
        Id = Guid.NewGuid();
    }
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public DateOnly PublishDate { get; set; } = DateOnly.FromDateTime(DateTime.Now);
}
