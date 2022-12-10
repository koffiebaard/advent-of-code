today:
	if [[ "$(day)" != "" ]]; then \
		day="$(day)"; \
	else \
		day=$$(date +'%d'); \
	fi; \
	if [[ "$${day}" =~ ^[0-9]+$$ ]]; then \
		echo "Creating day $${day}"; \
		dir="day-$${day}"; \
		[ -d "$${dir}" ] && echo "Idiot. Day $${day} already exists." && exit 1; \
		mkdir $${dir}; \
		touch $${dir}/example; \
		cp template_ts $${dir}/challenge.ts; \
		curl --cookie "session=${AOC_TOKEN}" https://adventofcode.com/2022/day/$${day}/input -A "Personal tool from Koffiebaard, koffiebaard.com" --output $${dir}/input; \
	fi
