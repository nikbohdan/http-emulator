using AutoMapper;
using HttpLearningApp.Domain.DTOs;
using HttpLearningApp.Domain.Entities;

namespace HttpLearningApp.API.Mappers
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            this.CreateMap<AddUserDTO, User>();
        }
    }
}
