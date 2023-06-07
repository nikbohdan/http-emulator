using HttpLearningApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HttpLearningApp.DAL.Data
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().Property(x => x.Name).IsRequired().HasMaxLength(1000);
            modelBuilder.Entity<User>().HasIndex(x => x.Email).IsUnique();
        }
    }
}
