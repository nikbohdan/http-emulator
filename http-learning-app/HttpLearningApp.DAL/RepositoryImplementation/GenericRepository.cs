using HttpLearningApp.DAL.Data;
using HttpLearningApp.Domain.Entities;
using HttpLearningApp.Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace HttpLearningApp.DAL.RepositoryImplementation
{
    public class GenericRepository<T> : IGenericRepository<T>
        where T : BaseEntity
    {
        private readonly DataContext dataContext;

        public GenericRepository(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public async Task<int> CreateAsync(T entity)
        {
            var entityEntry = await this.dataContext.Set<T>().AddAsync(entity);
            await this.dataContext.SaveChangesAsync();

            return entityEntry.Entity.Id;
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await this.GetByIdAsync(id);

            this.dataContext.Set<T>().Remove(entity);
            await this.dataContext.SaveChangesAsync();
        }

        public async Task DeleteRangeAsync(IEnumerable<T> entities)
        {
            this.dataContext.Set<T>().RemoveRange(entities);

            await this.dataContext.SaveChangesAsync();
        }

        public IQueryable<T> Find(bool disableTracking = true,
            Expression<Func<T, bool>> predicateExpression = null,
            Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null)
        {
            var query = this.dataContext.Set<T>().AsQueryable();

            if (disableTracking)
            {
                query.AsNoTracking();
            }

            if (include != null)
            {
                query = include(query);
            }

            if (predicateExpression != null)
            {
                query = query.Where(predicateExpression);
            }

            return query;
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicateExpression = null,
            bool disableTracking = true)
        {
            var query = this.dataContext.Set<T>().AsQueryable();

            if (disableTracking)
            {
                query.AsNoTracking();
            }

            if (predicateExpression != null)
            {
                query = query.Where(predicateExpression);
            }

            var users = await query.ToListAsync();
            return users;
        }

        public async Task<IEnumerable<T>> FindAsync() => await this.dataContext.Set<T>().ToListAsync();

        public async Task<T?> GetByIdAsync(int id, Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null, bool disableTracking = true)
        {
            IQueryable<T?> query = this.dataContext.Set<T>().AsQueryable();

            if (disableTracking)
            {
                query.AsNoTracking();
            }

            if (include != null)
            {
                query = include(query);
            }

            return await query.FirstOrDefaultAsync(entity => entity.Id == id);
        }

        public async Task UpdateAsync(T entity)
        {
            this.dataContext.Set<T>().Update(entity);
            await this.dataContext.SaveChangesAsync();
        }

        public async Task UpdateRangeAsync(IEnumerable<T> entities)
        {
            this.dataContext.Set<T>().UpdateRange(entities);
            await this.dataContext.SaveChangesAsync();
        }
    }
}
