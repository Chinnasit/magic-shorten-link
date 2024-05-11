package main

import (
	"log"
	"net/http"
	"os"
	"time"
	"math/rand"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type ShortlyLink struct {
	gorm.Model
	OriginalURL string `gorm: "unique"`
	ShortURL    string `gorm: "unique"`
}

type ShortUrlBodyRequest struct {
	Url    string `json: "url binding: "required"`
	CustomUrl string `json: custom_url`
}

var db *gorm.DB

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbUsername := os.Getenv("DB_USERNAME")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")
	dsn := dbUsername + ":" + dbPassword + "@tcp(" + dbHost + ":" + dbPort + ")/" + dbName + "?parseTime=true"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	db.AutoMigrate(&ShortlyLink{})
	r := gin.Default()
	r.Use(cors.Default())

	r.POST("/shorted", func(c *gin.Context) {
		var bodyRequest ShortUrlBodyRequest
		if err := c.ShouldBindJSON(&bodyRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// check if a custom_url or original_url had existed. 
		var existingLink ShortlyLink
		result := db.Where("original_url = ? OR short_url = ?", bodyRequest.Url, bodyRequest.CustomUrl).First(&existingLink)
		if result.Error == nil {
			c.JSON(http.StatusConflict, gin.H{"message": "URL or Custom URL already exists"})
			return
		}

		shortUrl := getshortUrl(bodyRequest)
		link := ShortlyLink{OriginalURL: bodyRequest.Url, ShortURL: shortUrl}
		result = db.Create(&link)
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"short_url": link.ShortURL})
	})

	r.GET("/:shortUrl", func(c *gin.Context) {
		shortURL := c.Param("shortUrl")
		var link ShortlyLink
		result := db.Where("short_url = ?", shortURL).Find(&link)

		if result.Error != nil {
			if result.Error == gorm.ErrRecordNotFound {
				c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			}
			return
		}

		c.Redirect(http.StatusMovedPermanently, link.OriginalURL)
	})

	r.Run(":8000")
}

func getshortUrl(bodyRequest ShortUrlBodyRequest) string {
	if bodyRequest.CustomUrl != "" {
		return bodyRequest.CustomUrl
	}

	const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	source := rand.NewSource(time.Now().UnixNano())
	rng := rand.New(source)
	shortUrl := ""
	
	for i := 0; i < 6; i++ {
		shortUrl += string(chars[rng.Intn(len(chars))])
	}

	return shortUrl
}
