SRC_DIR = src
BUILD_DIR = build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

BASE_FILES = \
	${SRC_DIR}/hex.core.js\
	${SRC_DIR}/hex.element.js\
	${SRC_DIR}/hex.event.js\
	${SRC_DIR}/hex.grid.js\
	${SRC_DIR}/hex.grid.hexagonal.js\
	${SRC_DIR}/hex.grid.rectangular.js\
	${SRC_DIR}/hex.grid.skew.js\
	${SRC_DIR}/hex.grid.triangular.js\
	${SRC_DIR}/hex.region.js\
	${SRC_DIR}/hex.sprite.js

MODULES = \
	${SRC_DIR}/hex.intro.js\
	${BASE_FILES}\
	${SRC_DIR}/hex.outro.js

LICENSES = \
	${SRC_DIR}/hex.license.js

HEX = ${DIST_DIR}/hex.js
HEX_MIN = ${DIST_DIR}/hex.min.js

HEX_VER = `cat version.txt`
VER = sed s/@VERSION/${HEX_VER}/

RHINO = java -jar ${BUILD_DIR}/js.jar
MINJAR = java -jar ${BUILD_DIR}/google-compiler-20100514.jar

DATE=`git log -1 | grep Date: | sed 's/[^:]*: *//'`

all: hex lint min
	@@echo "hexlib build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

init:
	@@echo "Grabbing external dependencies..."
	@@if test ! -d test/qunit/.git; then git clone git://github.com/jquery/qunit.git test/qunit; fi
	- @@cd test/qunit && git pull origin master > /dev/null 2>&1

hex: ${DIST_DIR} ${HEX}

${HEX}: init ${MODULES}
	@@echo "Building" ${HEX}

	@@mkdir -p ${DIST_DIR}

	@@cat ${LICENSES} ${MODULES} | \
		sed 's/Date:./&'"${DATE}"'/' | \
		${VER} > ${HEX};

lint: ${HEX}
	@@echo "Checking hexlib against JSLint..."
	@@${RHINO} build/jslint-check.js

min: ${HEX_MIN}

${HEX_MIN}: ${HEX}
	@@echo "Building" ${HEX_MIN}

	@@cat ${LICENSES} | \
		sed 's/Date:./&'"${DATE}"'/' | \
		${VER} > ${HEX_MIN}
	@@${MINJAR} --js ${HEX} --warning_level QUIET >> ${HEX_MIN}

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}

	@@echo "Removing cloned directories"
	@@rm -rf test/qunit
