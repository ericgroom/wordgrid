import posed from "react-pose";

const ToTheLeft = posed.div({
  enter: {
    x: 0,
    opacity: 1,
    beforeChildren: true,
    transition: {
      type: "spring",
      dampening: 500,
      mass: 0.01,
      stiffening: 500
    }
  },
  exit: {
    x: "-10%",
    opacity: 0,
    transition: {
      type: "spring",
      dampening: 100,
      mass: 0.1,
      stiffening: 200
    }
  }
});

export default ToTheLeft;
