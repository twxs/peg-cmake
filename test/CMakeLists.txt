cmake_minimum_required(VERSION #ARG COMMENT
3.2.0            #Major[.Minor[.Patch[.Tweak]]]
FATAL_ERROR)
     if( (ARG AND ${ARG}) OR TRUE ) 
           message("(arguments)")
endif()


foreach(p
CMP0020 #CMake 2.8.11
 CMP0022 #           CMake 2.8.12
    CMP0025 #                    CMake 3.0
CMP0053                   #CMake 3.1
)
if(              TRUE)
message( "IF")
elseif(   FALSE    )
                   message("ELSEIF")
  else()
 message("ELSE")
endif()
endforeach()
