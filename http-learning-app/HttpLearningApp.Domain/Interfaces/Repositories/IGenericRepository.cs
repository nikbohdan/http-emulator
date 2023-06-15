using HttpLearningApp.Domain.Entities;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace HttpLearningApp.Domain.Interfaces.Repositories
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        Task<int> CreateAsync(T entity);

        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicateExpression = null,
            bool disableTracking = true); 
        
        Task<IEnumerable<T>> FindAsync();

        IQueryable<T> Find(
            bool disableTracking = true,
            Expression<Func<T, bool>> predicateExpression = null,
            Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null);

        Task DeleteAsync(int id);

        Task UpdateAsync(T entity);

        Task UpdateRangeAsync(IEnumerable<T> entities);

        Task<T?> GetByIdAsync(int id, Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null, bool disableTracking = true);

        Task DeleteRangeAsync(IEnumerable<T> entities);
    }
}
