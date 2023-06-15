using HttpLearningApp.API.Mappers;
using HttpLearningApp.BLL.Implementation;
using HttpLearningApp.DAL.Data;
using HttpLearningApp.DAL.RepositoryImplementation;
using HttpLearningApp.Domain.Entities;
using HttpLearningApp.Domain.Interfaces.Repositories;
using HttpLearningApp.Domain.Interfaces.Services;
using HttpLearningApp.Utils.RequestDetailsHelper;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

const string DEFAULT_CONNECTION = "DefaultConnection";

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString(DEFAULT_CONNECTION)));

builder.Services.AddScoped<IGenericRepository<User>, GenericRepository<User>>();
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<IRequestDetailsService, RequestDetailsService>();

builder.Services.AddAutoMapper(typeof(MapperProfile));

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
