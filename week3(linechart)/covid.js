d3.csv("corona.csv", ({ date, value }) => ({ date, value: +value }))
    .then((d) => {
        const data = Object.assign(d, { y: "명" });
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const height = 500;
        const width = 1000;

        const parseDate = d3.timeParse("%m-%d");

        x = d3.scaleUtc()
            .domain(d3.extent(data, d => parseDate(d.date)))
            .range([margin.left, width - margin.right])

        y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)]).nice()
            .range([height - margin.bottom, margin.top]);

        line = d3.line()
            .defined(d => !isNaN(d.value))
            .x(d => x(parseDate(d.date)))
            .y(d => y(d.value));

        xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width/80).tickSizeOuter(0));

        yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 5)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data.y));

        const svg = d3.select("svg")
            .attr("viewBox", [0, 0, width, height]);

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", "1.5px")
            .attr("d", line);

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);
    })