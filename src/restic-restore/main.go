package main

import (
	"os"

	"github.com/gin-gonic/gin"
)

type Repo struct {
	Id string
}

func setupRouter() *gin.Engine {
	config_path := getEnvVarOrDefault("RESTORE_CONFIG_PATH", "/configs")

	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.Redirect(302, "./app")
	})

	r.Static("/app", getEnvVarOrDefault("UI_PATH", "./ui"))

	r.GET("/api/repos", func(c *gin.Context) {
		configs, err := os.ReadDir(config_path)
		if err == nil {
			repos := []Repo{}

			for _, config := range configs {
				repos = append(repos, Repo{Id: config.Name()})
			}

			c.JSON(200, gin.H{
				"repos": repos,
			})
		} else {
			c.JSON(504, gin.H{
				"msg": err,
			})
		}

	})

	r.POST("/api/repo", func(c *gin.Context) {
		//TODO: write the repo to the specified ID
		c.JSON(504, gin.H{
			"msg": "not yet implemented.",
		})
	})

	r.GET("/api/repo/:repoid/gen-token", func(c *gin.Context) {
		// todo: list snapshots
		c.JSON(504, gin.H{
			"msg": "not yet implemented.",
		})
	})

	r.GET("/api/repo/:repoid", func(c *gin.Context) {
		// todo: list snapshots
		c.JSON(504, gin.H{
			"msg": "not yet implemented.",
		})
	})

	r.GET("/api/snapshot/:repoid/:snapshotid", func(c *gin.Context) {
		// TODO: list files from snapshot for the specified path.
		c.JSON(504, gin.H{
			"msg": "not yet implemented.",
		})
	})

	r.GET("/api/snapshot/:repoid/:snapshotid/download", func(c *gin.Context) {
		// TODO: download the snapshot data for the specified path.
		c.JSON(504, gin.H{
			"msg": "not yet implemented.",
		})
	})

	return r
}

func main() {
	r := setupRouter()
	r.Run(":" + getEnvVarOrDefault("HTTP_PORT", "8888"))
}

func getEnvVarOrDefault(varName string, defaultValue string) string {
	variable := os.Getenv(varName)
	if variable == "" {
		return defaultValue
	} else {
		return variable
	}
}
