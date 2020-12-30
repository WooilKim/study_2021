d3.json("miserables.json")
    .then(data => {
        height = 600
        width = 600

        color = () => {
            const scale = d3.scaleOrdinal(d3.schemeCategory10);
            return d => scale(d.group);
        }

        const links = data.links.map(d => Object.create(d));
        const nodes = data.nodes.map(d => Object.create(d));

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });


        drag = simulation => {

            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }

        const svg = d3.select("svg")
            .attr("viewBox", [0, 0, width, height]);

        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value));

        change_color = (obj) => {
            if(obj.getAttribute("selected")=="false"){
                obj.setAttribute("fill", "#000");
                obj.setAttribute("selected", true);
            }
            else{
                obj.setAttribute("fill", obj.getAttribute("org_color"));
                obj.setAttribute("selected", false);
            }
        }

        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("id", "node")
            .attr("r", 5)
            .attr("fill", color())
            .attr("org_color", color())
            .attr("selected", false)
            .attr("onclick", `change_color(this)`)
            .call(drag(simulation));

        node.append("title")
            .text(d => d.id);

        document.getElementById("delete").addEventListener('click', () => {
            all_nodes = document.getElementsByTagName("circle");
            
            for(let i=0; i<all_nodes.length; i++){
                if(all_nodes[i].getAttribute("selected")=="true") all_nodes[i].remove();
            }
        })
    })