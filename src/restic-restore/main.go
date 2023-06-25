package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"log"
	"os"
	"os/exec"

	"github.com/atheken/restic-restore/model"
	"github.com/gin-gonic/gin"
)

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
			repos := []model.Repo{}

			for _, config := range configs {
				repos = append(repos, model.Repo{Id: config.Name()})
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
		c.JSON(200, launchRestic[model.Snapshot](config_path+"/"+c.Param("repoid"), "", "-v", "snapshots", "--json"))
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

func launchRestic[R any](configPath string, password string, args ...string) []R {
	cmd := exec.Command("restic", args...)
	var buffer bytes.Buffer
	cmd.Stderr = &buffer
	result, err := os.Open(configPath)
	if err != nil {
		log.Fatal("loading config failed")
	}

	// read the environment from the specified file:
	scan := bufio.NewScanner(result)
	for scan.Scan() {
		var line = scan.Text()
		cmd.Env = append(cmd.Env, line)
	}

	// if a password was provided, specify it as an env var, too.
	if password != "" {
		cmd.Env = append(cmd.Env, "RESTIC_PASSWORD="+password)
	}

	var retval []R = []R{}

	pipe, err := cmd.StdoutPipe()
	scan = bufio.NewScanner(pipe)

	err = cmd.Start()

	if err != nil {
		log.Fatal("starting the command failed.")
	}

	for scan.Scan() {
		var record R
		err = json.Unmarshal(scan.Bytes(), &record)
		if err != nil {
			log.Print(err)
		} else {
			retval = append(retval, record)
			log.Print(scan.Text())
		}
	}

	err = cmd.Wait()

	if err != nil {
		log.Fatal(buffer.String())
		log.Fatal("waiting for the command to complete failed")
	}

	return retval
}

func getEnvVarOrDefault(varName string, defaultValue string) string {
	variable := os.Getenv(varName)
	if variable == "" {
		return defaultValue
	} else {
		return variable
	}
}
