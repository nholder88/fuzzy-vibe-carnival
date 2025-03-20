FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY src/ShoppingService.API/*.csproj ./src/ShoppingService.API/
RUN dotnet restore ./src/ShoppingService.API/ShoppingService.API.csproj

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out src/ShoppingService.API/ShoppingService.API.csproj

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app/out .

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["dotnet", "ShoppingService.API.dll"] 