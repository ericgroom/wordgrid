import _ from "lodash";


/**
 * If the element passed to this function already exists in the array,
 * the return value will be the array upto and including the element;
 * otherwise, the element will be appended to the array.
 *
 * Note: This function does not modify the original array. For now
 * only shallow comparison is used.
 *
 * Example:
 * appendOrRevert([1, 2, 3, 5], 2) // [1, 2]
 * appendOrRevert([1, 2, 3], 4) // [1, 2, 3, 4]
 *
 * @param {[T]} array the array that is appended to
 * @param {T} elem the element to append/revert to (in) the array.
 * @returns {[T]}
 */
export function appendOrRevert(array, elem) {
    return [..._.takeWhile(array, e => e !== elem), elem];
}

/**
 * Converts a flat array index into a 2d coordinate
 * @param {number} index index in array
 * @param {number} size size of the square grid
 * @returns {Object} coord
 */
export function indexToXY(index, size) {
    return {
        x: index % size,
        y: Math.floor(index / size)
    };
}

/**
 * Converts a 2d coordinate into a flat array index
 * @param {Object} coord x, y coordinate
 * @param {number} size size of the square grid
 * @returns {number} index
 */
export function XYToIndex(coord, size) {
    return coord.y * size + coord.x;
}

/**
 * Curried function that can be passed to bfs for simple square grid
 * @param {number} index array index to find neighbors for
 * @param {number} size size of grid
 * @returns function that takes index
 */
export function gridNeighbors(size) {
    return function (index) {
        const {
            x,
            y
        } = indexToXY(index, size);
        let neighbors = [];
        for (let dx = -1; dx <= 1; dx += 1) {
            for (let dy = -1; dy <= 1; dy += 1) {
                const newX = x + dx;
                const newY = y + dy;
                if (newX >= 0 && newX < size && newY >= 0 && newY < size && (newX !== x || newY !== y)) {
                    const index = XYToIndex({
                        x: newX,
                        y: newY
                    }, size);
                    // trick to prefer straight lines over diagonal lines
                    // iff the two have equal distances
                    if (dx === 0 || dy === 0) {
                        neighbors.unshift(index)
                    } else {
                        neighbors.push(index);
                    }
                }
            }
        }
        return neighbors;
    }
}

/**
 * Walks between two indicies in a grid and fills in any gaps
 * @param {number} from array index
 * @param {number} to array index
 * @param {Optional}
 * @returns {Array<number>} returns an array of path taken
 */
export function bfs(from, to, neighborsFor) {
    let queue = [from];
    let visited = [from];
    let parent = {};
    const MAX_ITERATIONS = 2000;

    function backtrace(from, to, parent) {
        let path = [to];
        const MAX_LEN = 17;
        let i = 0;
        while (i < MAX_LEN && parent.hasOwnProperty(path[path.length - 1])) {
            const prev = parent[path[path.length - 1]];
            path.push(prev);
            if (prev === from) {
                return path;
            }
            i++;
        }
        if (i >= MAX_LEN)
            throw new Error("backtrace max iterations exceeded");
        return path;
    }
    let i = 0;
    while (queue.length > 0 && i < MAX_ITERATIONS) {
        const curr = queue.shift();
        for (let n of neighborsFor(curr)) {
            if (!visited.includes(n)) {
                queue.push(n);
                visited.push(n);
                parent[n] = curr;
            }
            if (n === to) {
                const path = backtrace(from, to, parent).reverse();
                return path;
            }
        }
        i++;
    }
    if (i >= MAX_ITERATIONS) {
        throw new Error("bfs MAX_ITERATIONS surpassed");
    }
    throw new Error("bfs path not found")
}