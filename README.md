### 端口查杀

```markdown
查端口PID: netstat -lnp|grep 8001  /  netstat -anp|grep 8001
杀端口PID: kill -9 PID

```

### 进程名查杀

```markdown
查进程PID: ps -ef|grep redis
杀进程PID: kill -9 PID

```

ps aux|grep celery|grep -v grep|cut -c 9-15|xargs kill -9
ps auxww | grep 'chrome' | awk '{print $2}' | xargs kill -9

netstat -lnp|grep 8000
netstat -lnp|grep 8081

kill -9 

nohup python3.6 manage.py runserver 0.0.0.0:8000 > /opt/AutoPlatform/STL/logs/server8000.log 2>&1 &

python3.6 run_timetask_apscheduler.py

cnpm run dev
