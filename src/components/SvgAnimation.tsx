import { useEffect } from "react";
import { gsap } from "gsap";
// import Ethan from "@/src/assets/svg/Ethan";
import Ethan2 from "@/src/assets/svg/Ethan2";

const SvgAnimation = () => {
  // Create a GreenSock timeline that will repeat infinitely
  const tl = gsap.timeline({
    id: "Timeline",
    // repeat: -1,
    // repeatDelay: 2.5,
  });

  const colors = ["#3341e0", "#20c9dc", "#cce4ff"];
  function tween(node: SVGPathElement) {
    let path = node;
    const delay = Math.random() * 1;
    const length = path.getTotalLength();
    colors.forEach((color, index) => {
      if (index !== 0 && node.parentNode) {
        path = path.cloneNode() as SVGPathElement;
        node.parentNode.appendChild(path);
      }
      path.setAttribute("stroke", color);
      tl.set(
        path,
        {
          strokeDasharray: length * 2.5 + 0.5,
          strokeDashoffset: length * 2.5 + 0.6,
          autoRound: "false",
        },
        0
      );
      tl.to(
        path,
        {
          strokeDashoffset: 0,
          autoRound: false,
          duration: 1.7,
          ease: "power3.out",
        },
        index * 0.25 + delay
      );
    });
  }

  useEffect(() => {
    document
      .querySelectorAll(".motion path, .motion line")
      .forEach((p) => tween(p as SVGPathElement));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-auto w-full sm:w-8/12 xl:w-full">
      {/* <Ethan cn="motion" /> */}
      <Ethan2 cn="motion" />
    </div>
  );
};

export default SvgAnimation;
